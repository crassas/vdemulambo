const fs = require('fs');
let code = fs.readFileSync('src/components/LoginPage.tsx', 'utf8');

const target = `  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Credenciais inválidas. Verifique os seus dados de acesso.');
    } finally {
      setIsLoading(false);
    }
  };`;

const replacement = `  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Mock accounts for testing without Firebase Auth Email/Password enabled
    if (email === 'mentora@altar.com' && password === 'mentora123') {
      const dummyProfile = { uid: 'dummy-admin', nome: 'Mentora O Altar', email: 'mentora@altar.com', role: 'admin' };
      localStorage.setItem('dummyUser', JSON.stringify(dummyProfile));
      window.location.reload();
      return;
    }
    
    if (email === 'cliente@altar.com' && password === 'cliente123') {
      const dummyProfile = { uid: 'dummy-cliente', nome: 'Cliente Teste', email: 'cliente@altar.com', role: 'cliente' };
      localStorage.setItem('dummyUser', JSON.stringify(dummyProfile));
      window.location.reload();
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Credenciais inválidas. Verifique os seus dados de acesso.');
    } finally {
      setIsLoading(false);
    }
  };`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/LoginPage.tsx', code);
console.log('Login patched');
