import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate('/'); // Redirigir al Dashboard
    } else {
      setError('Credenciales inválidas. Prueba: admin@ong.com / 123456');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-teal-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[100px]"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex relative z-10 min-h-[600px]">
        
        {/* Lado Izquierdo: Visual */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-12 flex-col justify-between text-white relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30">
              <HeartHandshake size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Gestión ONG</h2>
            <p className="text-slate-300 leading-relaxed">
              "La transparencia y la eficiencia son los pilares para maximizar nuestro impacto social."
            </p>
          </div>
          
          <div className="relative z-10 text-sm text-slate-400">
            © 2025 Sistema de Gestión UTP
          </div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Bienvenido de nuevo</h2>
            <p className="text-slate-500 mt-2">Ingresa tus credenciales para acceder al panel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="admin@ong.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-slate-900/20">
              Iniciar Sesión <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">Credenciales Demo:</p>
            <p className="text-xs font-mono bg-slate-100 inline-block px-2 py-1 rounded mt-2 text-slate-600">admin@ong.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}