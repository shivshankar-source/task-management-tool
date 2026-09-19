import React, { useState } from 'react'

const Login = ({handleLogin, onBackToHome}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = (e)=>{
        e.preventDefault()
        handleLogin(email,password)
        setEmail("")
        setPassword("")
    }

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-900'>
        
        <button 
            onClick={onBackToHome}
            className='absolute top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300'
        >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
            </svg>
            <span className='font-medium'>Back to Home</span>
        </button>

        <div className='bg-white/5 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl p-12 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-500 w-[450px]'>
            
            <div className='text-center mb-8'>
                <div className='w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                    <span className='text-3xl font-bold text-white'>T</span>
                </div>
                <h2 className='text-3xl font-bold text-white mb-2'>Welcome Back!</h2>
                <p className='text-gray-400'>Sign in to access your dashboard</p>
            </div>

            <form 
            onSubmit={(e)=>{
                submitHandler(e)
            }}
            className='flex flex-col items-center justify-center space-y-6'
            >
                
                <div className='w-full'>
                    <label className='block text-gray-300 text-sm font-medium mb-2 ml-1'>Email Address</label>
                    <input 
                    value={email}
                    onChange={(e)=>{
                        setEmail(e.target.value)
                    }}
                    required 
                    className='w-full outline-none bg-white/10 border-2 border-emerald-500/30 focus:border-emerald-500 font-medium text-lg py-3 px-6 rounded-xl placeholder:text-gray-500 text-white transition-all duration-300' 
                    type="email" 
                    placeholder='Enter your email' 
                    />
                </div>

                
                <div className='w-full'>
                    <label className='block text-gray-300 text-sm font-medium mb-2 ml-1'>Password</label>
                    <input
                    value={password}
                    onChange={(e)=>{
                        setPassword(e.target.value)
                    }}
                    required 
                    className='w-full outline-none bg-white/10 border-2 border-emerald-500/30 focus:border-emerald-500 font-medium text-lg py-3 px-6 rounded-xl placeholder:text-gray-500 text-white transition-all duration-300' 
                    type="password" 
                    placeholder='Enter password' 
                    />
                </div>

                
                <div className='w-full bg-blue-500/10 border border-blue-500/30 rounded-xl p-4'>
                    <p className='text-blue-300 text-xs font-semibold mb-2'>📝 Demo Credentials:</p>
                    <div className='text-gray-300 text-xs space-y-1'>
                        <p><span className='font-medium text-emerald-400'>Admin:</span> admin@example.com / 123456</p>
                        <p><span className='font-medium text-blue-400'>Manager:</span> manager@example.com / 123456</p>
                        <p><span className='font-medium text-cyan-300'>Employee:</span> employee@example.com / 123456</p>
                        <p className='text-white/60'>New users are created by Admin.</p>
                    </div>
                </div>

                
                <button className='w-full mt-4 text-white border-none outline-none hover:scale-105 font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-lg py-3 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70'>
                    Login →
                </button>
            </form>

            
            <div className='flex items-center my-6'>
                <div className='flex-1 border-t border-gray-600'></div>
                <span className='px-4 text-gray-400 text-sm'>or</span>
                <div className='flex-1 border-t border-gray-600'></div>
            </div>

            
            <p className='text-center text-gray-400 text-sm'>
                Need help? <a href='#' className='text-emerald-400 hover:text-emerald-300 font-medium'>Contact Support</a>
            </p>
        </div>
    </div>
  )
}

export default Login