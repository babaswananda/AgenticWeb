// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AgenticStaking
 * @dev Institutional-grade staking contract for Agentic Web protocol
 * Features tiered staking with SLA guarantees and yield distribution
 */
contract AgenticStaking is ReentrancyGuard, Ownable {
    
    struct StakeTier {
        uint256 minAmount;      // Minimum stake amount in wei
        uint256 apy;           // APY in basis points (e.g., 820 = 8.2%)
        string sla;            // SLA guarantee percentage
        string trancheAccess;  // Tranche access level
        string yieldType;      // Type of yield mechanism
        bool active;           // Whether tier is active
    }

    struct UserStake {
        uint256 amount;        // Total staked amount
        uint8 tier;           // Current tier level
        uint256 stakedAt;     // Timestamp of stake
        uint256 lastClaim;    // Last yield claim timestamp
        bool active;          // Whether stake is active
    }

    // State variables
    IERC20 public stakingToken;
    mapping(uint8 => StakeTier) public tiers;
    mapping(address => UserStake) public userStakes;
    mapping(address => uint256) public pendingYield;
    
    uint256 public totalStaked;
    uint256 public totalYieldDistributed;
    uint8 public constant MAX_TIER = 4;
    
    // Events
    event Staked(address indexed user, uint256 amount, uint8 tier);
    event Unstaked(address indexed user, uint256 amount);
    event YieldClaimed(address indexed user, uint256 amount);
    event TierUpdated(uint8 tier, uint256 minAmount, uint256 apy);
    event SLAViolation(address indexed user, uint256 penalty);

    constructor(address _stakingToken) {
        stakingToken = IERC20(_stakingToken);
        
        // Initialize tier structure
        tiers[1] = StakeTier(1200 ether, 0, "99.5%", "None", "None", true);
        tiers[2] = StakeTier(5000 ether, 820, "99.9%", "Tier 3", "Tranche Tokens", true);
        tiers[3] = StakeTier(12000 ether, 1270, "99.99%", "Tier 1-3", "Revenue Share", true);
        tiers[4] = StakeTier(50000 ether, 1500, "99.999%", "Tier 0-3", "Equity Participation", true);
    }

    /**
     * @dev Stake tokens for a specific tier
     * @param tier The tier level to stake for (1-4)
     * @param amount Amount of tokens to stake
     */
    function stake(uint8 tier, uint256 amount) external nonReentrant {
        require(tier >= 1 && tier <= MAX_TIER, "Invalid tier");
        require(tiers[tier].active, "Tier not active");
        require(amount >= tiers[tier].minAmount, "Insufficient stake amount");
        
        UserStake storage userStake = userStakes[msg.sender];
        
        // Transfer tokens from user
        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Update user stake
        if (userStake.active) {
            // Add to existing stake
            userStake.amount += amount;
        } else {
            // New stake
            userStake.amount = amount;
            userStake.stakedAt = block.timestamp;
            userStake.lastClaim = block.timestamp;
            userStake.active = true;
        }
        
        userStake.tier = tier;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount, tier);
    }

    /**
     * @dev Unstake tokens (with potential penalties for early withdrawal)
     * @param amount Amount to unstake
     */
    function unstake(uint256 amount) external nonReentrant {
        UserStake storage userStake = userStakes[msg.sender];
        require(userStake.active, "No active stake");
        require(amount <= userStake.amount, "Insufficient staked amount");
        
        // Calculate any penalties for early withdrawal
        uint256 penalty = calculateUnstakePenalty(msg.sender, amount);
        uint256 withdrawAmount = amount - penalty;
        
        // Update stake
        userStake.amount -= amount;
        if (userStake.amount == 0) {
            userStake.active = false;
        }
        
        totalStaked -= amount;
        
        // Transfer tokens back to user
        require(stakingToken.transfer(msg.sender, withdrawAmount), "Transfer failed");
        
        emit Unstaked(msg.sender, withdrawAmount);
    }

    /**
     * @dev Claim accumulated yield
     */
    function claimYield() external nonReentrant {
        uint256 yield = calculateYield(msg.sender);
        require(yield > 0, "No yield to claim");
        
        UserStake storage userStake = userStakes[msg.sender];
        userStake.lastClaim = block.timestamp;
        pendingYield[msg.sender] = 0;
        
        totalYieldDistributed += yield;
        
        // Transfer yield (this would integrate with yield generation mechanism)
        require(stakingToken.transfer(msg.sender, yield), "Yield transfer failed");
        
        emit YieldClaimed(msg.sender, yield);
    }

    /**
     * @dev Calculate current yield for a user
     * @param user Address of the user
     * @return yield amount
     */
    function calculateYield(address user) public view returns (uint256) {
        UserStake memory userStake = userStakes[user];
        if (!userStake.active || tiers[userStake.tier].apy == 0) {
            return pendingYield[user];
        }
        
        uint256 timeStaked = block.timestamp - userStake.lastClaim;
        uint256 annualYield = (userStake.amount * tiers[userStake.tier].apy) / 10000;
        uint256 currentYield = (annualYield * timeStaked) / 365 days;
        
        return pendingYield[user] + currentYield;
    }

    /**
     * @dev Calculate penalty for early unstaking
     * @param user Address of the user
     * @param amount Amount being unstaked
     * @return penalty amount
     */
    function calculateUnstakePenalty(address user, uint256 amount) public view returns (uint256) {
        UserStake memory userStake = userStakes[user];
        
        // No penalty after 1 year
        if (block.timestamp >= userStake.stakedAt + 365 days) {
            return 0;
        }
        
        // Penalty decreases over time (max 10% for immediate withdrawal)
        uint256 timeStaked = block.timestamp - userStake.stakedAt;
        uint256 maxPenalty = amount / 10; // 10% max penalty
        uint256 penalty = maxPenalty - (maxPenalty * timeStaked) / 365 days;
        
        return penalty;
    }

    /**
     * @dev Get user's current tier information
     * @param user Address of the user
     * @return StakeTier struct
     */
    function getUserTier(address user) external view returns (StakeTier memory) {
        UserStake memory userStake = userStakes[user];
        if (!userStake.active) {
            return StakeTier(0, 0, "", "", "", false);
        }
        return tiers[userStake.tier];
    }

    /**
     * @dev Update tier parameters (owner only)
     * @param tier Tier level to update
     * @param minAmount New minimum amount
     * @param apy New APY in basis points
     */
    function updateTier(uint8 tier, uint256 minAmount, uint256 apy, string memory sla, string memory trancheAccess, string memory yieldType) external onlyOwner {
        require(tier >= 1 && tier <= MAX_TIER, "Invalid tier");
        
        tiers[tier].minAmount = minAmount;
        tiers[tier].apy = apy;
        tiers[tier].sla = sla;
        tiers[tier].trancheAccess = trancheAccess;
        tiers[tier].yieldType = yieldType;
        
        emit TierUpdated(tier, minAmount, apy);
    }

    /**
     * @dev Emergency function to pause/unpause a tier
     * @param tier Tier to toggle
     * @param active New active status
     */
    function setTierActive(uint8 tier, bool active) external onlyOwner {
        require(tier >= 1 && tier <= MAX_TIER, "Invalid tier");
        tiers[tier].active = active;
    }

    /**
     * @dev Distribute yield to all stakers (called by yield generation mechanism)
     * @param totalYield Total yield to distribute
     */
    function distributeYield(uint256 totalYield) external onlyOwner {
        require(totalStaked > 0, "No stakes to distribute to");
        
        // This is a simplified distribution - production would use more sophisticated logic
        // based on tier weights, time staked, etc.
        
        totalYieldDistributed += totalYield;
    }

    /**
     * @dev Handle SLA violations and apply penalties
     * @param user User to penalize
     * @param penaltyAmount Penalty amount
     */
    function applySLAPenalty(address user, uint256 penaltyAmount) external onlyOwner {
        UserStake storage userStake = userStakes[user];
        require(userStake.active, "No active stake");
        
        if (penaltyAmount >= userStake.amount) {
            // Full slash
            totalStaked -= userStake.amount;
            userStake.amount = 0;
            userStake.active = false;
        } else {
            // Partial slash
            userStake.amount -= penaltyAmount;
            totalStaked -= penaltyAmount;
        }
        
        emit SLAViolation(user, penaltyAmount);
    }

    /**
     * @dev Get contract statistics
     */
    function getStats() external view returns (uint256 _totalStaked, uint256 _totalYieldDistributed, uint256 _activeStakers) {
        // Count active stakers would require additional tracking in production
        return (totalStaked, totalYieldDistributed, 0);
    }
}
