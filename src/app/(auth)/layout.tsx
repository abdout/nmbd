const AuthLayout = ({ 
  children
}: { 
  children: React.ReactNode
}) => {
  return ( 
    <div className="h-screen flex items-center justify-center w-full max-w-[21rem] mx-auto">
      {children}
    </div>
   );
}
 
export default AuthLayout;