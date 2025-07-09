import React, { useState, useEffect } from "react";
import "./LiveChat.css";
import livechatopenbg from "../assets/Group 71.png";
import closebutton from "../assets/closebutton.png";
import sendicon from "../assets/sendicon.png";
import chatboticon from "../assets/chatlogo.svg";

// ✅ Tipuri
type ChatMessage = {
  id: number;
  text: string;
  from: "user" | "bot";
};

declare global {
  interface Window {
    language: string;
  }
}

const initialMessages: ChatMessage[] = [];

interface LiveChatProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ open: controlledOpen, setOpen: setControlledOpen }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [loading, setLoading] = useState(false);



  const sendStartRequest = (name: string) => {
    return fetch("https://lumea-mea.onrender.com/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((data) => {
        const botMsg: ChatMessage = {
          id: Date.now(),
          text: data.ask_name || "Cum te numești?",
          from: "bot",
        };
        const language = data.language;
        window.language = language;
        setMessages((prev) => [...prev, botMsg]);
        setUserName(name);
        setOnboardingStep(1);
      });
  };

  const sendInterestsRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userName, message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const fullMsg = data.ask_interests?.full_message || data.message || "Răspuns necunoscut.";
        const botMsg: ChatMessage = {
          id: Date.now(),
          text: fullMsg,
          from: "bot",
        };

        setMessages((prev) => [...prev, botMsg]);

        if (fullMsg.includes("Perfect! 😊 Pentru a continua cu rezervarea, te rog să-mi lași următoarele informații") || fullMsg.includes("Отлично! 😊 Чтобы продолжить бронирование, пожалуйста, укажите следующую информацию")){
          setOnboardingStep(9);
        }
        if (
          fullMsg.includes("Tur recomandat") ||
          fullMsg.includes("Хотите забронировать место?")
        ) {
          setOnboardingStep(7);
        } else if (
          fullMsg.includes("Ответь, пожалуйста: хочешь ли продолжить или тебя интересуют события? Да / Все события") ||
          fullMsg.includes("Acum răspunde te rog dacă vrei să continuăm sau dacă ești interesat de evenimente? Da / Toate evenimentele")
        ) {
          // rămâne pe pasul curent (1)
        } else {
          setOnboardingStep(2);
        }
      })
      .catch(err => {
        const errorMsg: ChatMessage = {
          id: Date.now(),
          text: "Eroare la comunicarea cu serverul: " + err.message,
          from: "bot",
        };
        setMessages((prev) => [...prev, errorMsg]);
      });
  };


  const sendPlanificareRequest = (interests: string) => {
    return fetch("https://lumea-mea.onrender.com/planificare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        interests,
        language: window.language,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const replyText = data.question || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages((prev) => [...prev, botMsg]);
        if(replyText.includes("!!!!")){
          setOnboardingStep(2);
          return;
        }
        if (replyText.includes("Europa, Turcia") || replyText.includes("Европа, Турция")) {
          setOnboardingStep(2);
        } else {
          setOnboardingStep(3);
        }
      });
  };

  const sendChatRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    })
      .then((res) => res.json())
      .then((data) => {
        const botMsg: ChatMessage = {
          id: Date.now(),
          text: data.reply || "Ne pare rău, nu am un răspuns acum.",
          from: "bot",
        };
        setMessages((prev) => [...prev, botMsg]);
      });
  };

  const sendDurataRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/durata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.question || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
  
        if (replyText.includes("!!!")) {
          setOnboardingStep(3);
        } else {
          setOnboardingStep(4);
        }
      });
  };

  const sendDificultateRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/dificultate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.question || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
  
        if (
          replyText.includes("2 săptămâni") ||
          replyText.includes("cam o săptămână") ||
          replyText.includes("un weekend") ||
          replyText.includes("peste 15 zile") ||
          replyText.includes("2 недели") ||
          replyText.includes("около недели") ||
          replyText.includes("выходные") ||
          replyText.includes("более 15 дней")
        ) {
          setOnboardingStep(4);
        } else {
          setOnboardingStep(5);
        }
      });
  };

  const sendBugetRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/buget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.question || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
  
        if (replyText.includes("!!!")) {
          setOnboardingStep(5);
        } else {
          setOnboardingStep(6);
        }
      });
  };

  const sendChatAdvancedRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userName, message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.reply || "Ne pare rău, nu am un răspuns acum.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
  
        if (replyText.includes("!!!")) {
          setOnboardingStep(6);
        } else if (
          replyText.includes("Mai multe detalii puteti vedea pe site-ul nostru!") ||
          replyText.includes("Doresti sa rezervi un loc? Da / Nu") ||
          replyText.includes("Подробнее вы можете узнать на нашем сайте!") ||
          replyText.includes("Хотите забронировать место? Да / Нет")
        ) {
          setOnboardingStep(7);
        } else {
          setOnboardingStep(8);
        }
      });
  };

  const sendExempleRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/exemple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.reply || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
  
        if (replyText.includes("!!!")) {
          setOnboardingStep(8);
        } else if (
          replyText.includes("Perfect! 😊 Pentru a continua cu rezervarea") ||
          replyText.includes("Отлично! 😊 Чтобы продолжить бронирование")
        ) {
          setOnboardingStep(9);
        }
      });
  };

  const sendSimpleChatRequest = async (msg: string) => {
    try {
      const res = await fetch("https://lumea-mea.onrender.com/simple_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, language: window.language }),
      });
  
      const data = await res.json();
      const replyText = data.reply || "Răspuns necunoscut.";
      const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
      setMessages(prev => [...prev, botMsg]);
      if (replyText.includes("Perfect! 😊 Pentru a continua cu rezervarea, te rog să-mi lași următoarele informații:")){
        setOnboardingStep(9);
      }
      if (replyText.includes("✅ Ajustăm în funcție de buget") || replyText.includes("✅ Настроим в соответствии с бюджетом") ) {
        setOnboardingStep(1);
      }
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: Date.now(),
        text: "Eroare la comunicare: " + (error as Error).message,
        from: "bot",
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };
  
  const sendReturnMessageRequest = (msg: string) => {
    return fetch("https://lumea-mea.onrender.com/return_message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, language: window.language }),
    })
      .then(res => res.json())
      .then(data => {
        const replyText = data.reply || "Răspuns necunoscut.";
        const botMsg: ChatMessage = { id: Date.now(), text: replyText, from: "bot" };
        setMessages(prev => [...prev, botMsg]);
        console.log(replyText.includes("Numărul introdus nu este valid"))
        console.log(replyText.includes("Îți mulțumesc pentru ca ai completat formularul!"))
        if ( replyText.includes("Numărul introdus nu este valid") || replyText.includes("Введённый номер недействителен") ) {
          setOnboardingStep(9);
        } else if (replyText.includes("Îți mulțumesc pentru ca ai completat formularul!")){
          setOnboardingStep(8);
        } else {
          setOnboardingStep(8);
        }
      });
  };


  const handleSend = async () => {
    if (message.trim() === "") return;

    const userMsg: ChatMessage = { id: Date.now(), text: message, from: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const currentStep = onboardingStep; // fix aici

    try {
      switch (currentStep) {
        case -1:
          await sendStartRequest(message);
          break;
        case 1:
          await sendInterestsRequest(message);
          break;
        case 2:
          await sendPlanificareRequest(message);
          break;
        case 3:
          await sendDurataRequest(message);
          break;
        case 4:
          await sendDificultateRequest(message);
          break;
        case 5:
          await sendBugetRequest(message);
          break;
        case 6:
          await sendChatAdvancedRequest(message);
          break;
        case 7:
          await sendExempleRequest(message);
          break;
        case 8:
          await sendSimpleChatRequest(message);
          break;
        case 9:
          await sendReturnMessageRequest(message);
          break;
        default:
          // fallback chat simplu
          await sendChatRequest(message);
      }
    } catch (error: any) {
      console.error("Eroare:", error);
      const errMsg: ChatMessage = {
        id: Date.now(),
        text: "Eroare la comunicarea cu serverul.",
        from: "bot",
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  // ✅ Inițializare - întreabă limba
  useEffect(() => {
    if (open) {
      setVisible(true);
      if (messages.length === 0 && onboardingStep === 0) {
        setLoading(true);
        fetch("https://lumea-mea.onrender.com/language")
          .then((res) => res.json())
          .then((data) => {
            // window.language = data.language || "RO";
            console.log("11111")
            console.log(data.ask_name)
            const botMsg: ChatMessage = {
              id: Date.now(),
              text: data.ask_name || "Bun venit! Care este numele tău?",
              from: "bot",
            };
            setMessages([botMsg]);
            setOnboardingStep(-1);
          })
          .catch(() => {
            const errMsg: ChatMessage = {
              id: Date.now(),
              text: "Eroare la comunicarea cu serverul.",
              from: "bot",
            };
            setMessages([errMsg]);
          })
          .finally(() => setLoading(false));
      }
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // ✅ Interfața
  return (
    <div>
      {!open && (
        <img
          src={chatboticon}
          className="livechat-chatboticon"
          alt="Deschide chat"
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            right: 40,
            bottom: 40,
            width: 80,
            height: 80,
            zIndex: 1001,
            cursor: "pointer",
          }}
        />
      )}
      {visible && (
        <div className={`livechat-modal${open ? "" : " closed"}`}>
          <img src={livechatopenbg} className="livechat-modal-bg" alt="Live Chat Modal BG" />
          <img
            src={closebutton}
            className="livechat-close-button"
            alt="Close"
            onClick={() => setOpen(false)}
          />
          <div className="livechat-messages" style={{ overflowY: "auto", maxHeight: "60vh" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`livechat-message livechat-message-${msg.from}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              ></div>
            ))}
            {loading && (
              <div className="livechat-message livechat-message-bot">...scriu răspuns...</div>
            )}
          </div>
          <div className="livechat-input-row">
            <input
              type="text"
              className="livechat-input"
              placeholder="Scrie-ți mesajul aici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={loading}
            />
            <button
              className="livechat-send-btn"
              onClick={handleSend}
              type="button"
              aria-label="Trimite mesaj"
              disabled={loading}
            >
              <img src={sendicon} alt="Send" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;
