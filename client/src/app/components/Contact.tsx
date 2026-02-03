import { useState } from "react";
import { Mail, Github, Linkedin, Instagram, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../../data/translations";

export function Contact() {
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations].contact;

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus('idle');

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error("Error en el envío al backend:", error);
      setStatus('error');
    } finally {
      setIsSending(false);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-background text-foreground relative overflow-hidden">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
            {t.title}<span className="text-primary">.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed italic">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-12">
          
          {/* Columna de Info: Ahora con flex-col y centrado en mobile */}
          <div className="lg:col-span-2 space-y-6 flex flex-col items-center lg:items-stretch">
            
            <a
              href="mailto:mnahuelsanchez94@gmail.com"
              className="w-full group flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4 p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 shadow-xl"
            >
              <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.emailLabel}</div>
                <div className="font-medium text-foreground">mnahuelsanchez94@gmail.com</div>
              </div>
            </a>

            <div className="w-full flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4 p-6 bg-card border border-border rounded-2xl shadow-xl">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <span className="text-2xl">📍</span>
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.locationLabel}</div>
                <div className="font-medium text-foreground">{t.locationValue}</div>
              </div>
            </div>

            {/* Redes Sociales: Centradas en mobile (justify-center) */}
            <div className="flex justify-center lg:justify-start gap-4 pt-4 w-full">
              {[
                { icon: <Github size={20} />, url: "https://github.com/NahuySan" },
                { icon: <Linkedin size={20} />, url: "https://linkedin.com/in/nahuelsan" },
                { icon: <Instagram size={20} />, url: "https://instagram.com/nahuelssanchez" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-card border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 transition-all shadow-md"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Formulario: Centrado por el mx-auto del container */}
          <div className="lg:col-span-3 bg-card border border-border rounded-4xl p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block ml-1">
                    {t.formName}
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 text-foreground"
                    placeholder={t.formNamePlaceholder}
                  />
                </div>

                <div className="space-y-2 text-left">
                  <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block ml-1">
                    {t.emailLabel}
                  </label>
                  <input
                    id="email"
                    name="email"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 text-foreground"
                    placeholder={t.formEmailPlaceholder}
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label htmlFor="message" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block ml-1">
                  {t.formMessage}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder={t.formMessagePlaceholder}
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {lang === 'es' ? 'Enviando...' : 'Sending...'}
                  </>
                ) : (
                  t.sendButton
                )}
              </button>

              <AnimatePresence mode="wait">
                {status === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 text-green-500 font-bold text-sm justify-center"
                  >
                    <CheckCircle2 size={18} />
                    {lang === 'es' ? '¡Mensaje enviado con éxito!' : 'Message sent successfully!'}
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 text-red-500 font-bold text-sm justify-center"
                  >
                    <AlertCircle size={18} />
                    {lang === 'es' ? 'Hubo un error. Intentá de nuevo.' : 'Something went wrong. Try again.'}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}