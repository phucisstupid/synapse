import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore, useSettingsStore } from "@/lib/store";
import { createAIClient } from "@/lib/ai";
import { cn } from "@/lib/utils/cn";

const SYSTEM_PROMPT = `You are Synapse, a friendly and knowledgeable AI study assistant. Your role is to:
- Help students understand complex concepts through clear explanations
- Provide examples, analogies, and real-world applications
- Encourage critical thinking with thought-provoking questions
- Adapt explanations to the student's level of understanding
- Suggest study strategies and learning techniques
- Be patient, supportive, and encouraging

Always aim to foster deep understanding rather than just providing answers.`;

export function ChatView() {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    activeConversationId,
    createConversation,
    addMessage,
    updateMessage,
    getActiveConversation,
  } = useChatStore();

  const { provider, model, getApiKey } = useSettingsStore();
  const activeConversation = getActiveConversation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const apiKey = getApiKey(provider);
    if (!apiKey) {
      alert("Please add your API key in Settings");
      return;
    }

    let conversationId = activeConversationId;
    if (!conversationId) {
      conversationId = createConversation();
    }

    const userMessage = input.trim();
    setInput("");
    addMessage(conversationId, { role: "user", content: userMessage });

    const assistantMessageId = addMessage(conversationId, {
      role: "assistant",
      content: "",
    });

    setIsStreaming(true);

    try {
      const client = createAIClient({ provider, apiKey, model });
      let fullResponse = "";

      for await (const chunk of client.chatStream(userMessage, SYSTEM_PROMPT)) {
        fullResponse += chunk;
        updateMessage(conversationId, assistantMessageId, fullResponse);
      }
    } catch (error) {
      updateMessage(
        conversationId,
        assistantMessageId,
        `Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!activeConversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Welcome to Synapse</h2>
          <p className="mt-2 text-muted-foreground">
            Your AI study assistant. Ask anything to get started.
          </p>
        </div>
        <Button onClick={() => createConversation()}>
          Start a conversation
        </Button>

        <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
          {[
            "Explain quantum entanglement simply",
            "Help me understand calculus derivatives",
            "Quiz me on world history",
            "Create a study plan for finals",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                createConversation();
                setInput(suggestion);
                inputRef.current?.focus();
              }}
              className="rounded-lg border bg-card p-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 px-4">
        <div className="mx-auto max-w-3xl space-y-4 py-4">
          {activeConversation.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
                )}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-card p-4">
        <div className="mx-auto flex max-w-3xl gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="min-h-[60px] resize-none"
            disabled={isStreaming}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="shrink-0"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
