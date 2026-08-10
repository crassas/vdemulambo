const fs = require('fs');

let content = fs.readFileSync('src/views/ClientView.tsx', 'utf8');

// Replace the merged case
content = content.replace(
  "case 'agenda':\n      case 'servicos':\n        return <ServicosView onSelectConsultation={() => setActiveTab('consultas')} onSelectChat={() => setActiveTab('mensagens')} />;",
  `case 'servicos':
        return <ServicosView onSelectConsultation={() => setActiveTab('consultas')} onSelectChat={() => setActiveTab('mensagens')} />;
      case 'agenda':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 pb-24"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-foreground font-bold mb-3">A Minha Agenda</h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Acompanhe as suas próximas marcações e histórico de consultas.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gold-dim">Próximas Sessões</h3>
              <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory custom-scrollbar">
                <AppointmentCard date="15 de Novembro" time="14:30" type="Consulta de Tarot" status="Confirmado" onClick={() => setActiveTab('mensagens')} />
                <AppointmentCard date="22 de Novembro" time="18:00" type="Trabalho Espiritual" status="A Confirmar" onClick={() => setActiveTab('mensagens')} />
              </div>
            </div>
          </motion.div>
        );`
);

content = content.replace(
  "case 'agenda':\n      case 'servicos': return 'Consultas e Serviços';",
  "case 'servicos': return 'Consultas e Serviços';\n      case 'agenda': return 'Agenda';"
);

fs.writeFileSync('src/views/ClientView.tsx', content);
