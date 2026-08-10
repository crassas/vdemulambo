const fs = require('fs');
let code = fs.readFileSync('src/views/CartaDoDiaView.tsx', 'utf8');

code = code.replace(/if \(docSnap\.exists\(\)\) \{\n\s*setCardData\(docSnap\.data\(\) as any\);\n\s*\} else \{\n[\s\S]*?\}\n\s*\} catch/, `if (docSnap.exists()) {
          setCardData(docSnap.data() as any);
        } else {
          setCardData(null);
        }
      } catch`);

let newReturn = `
  if (!cardData) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto mt-20 p-10 panel-base text-center"
      >
        <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mb-6 mx-auto glow-gold">
          <Moon className="w-8 h-8 text-gold" />
        </div>
        <h2 className="font-serif text-2xl text-cream mb-4">Ainda sem partilha</h2>
        <p className="text-muted text-sm leading-relaxed">
          A Kris ainda não publicou a carta de hoje.
          Receberá uma notificação assim que a orientação diária estiver disponível.
        </p>
      </motion.div>
    );
  }
`;

code = code.replace(/if \(!cardData\) return null;/, newReturn);

// Also remove the cardData.name from the UI if we don't want a generic name, wait, the mentora inputs the caption and image.
// "nunca um nome de carta genérico nem texto gerado sem a foto correspondente."
// In AdminCartaDia.tsx they upload image, and text. Let's see what AdminCartaDia has.
fs.writeFileSync('src/views/CartaDoDiaView.tsx', code);
