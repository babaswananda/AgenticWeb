import ChatStreamEngine from '@/components/ChatStreamEngine';

export default function EmbedPage() {
  return (
    <div className="h-screen">
      <ChatStreamEngine
        embedMode={true}
        config={{
          autoLoad: true,
          batchSize: 2,
          animationDelay: 300,
          enableAI: false,
          theme: 'dark',
        }}
      />
    </div>
  );
}
