const AuthLayout = ({ 
  children
}: { 
  children: React.ReactNode
}) => {
  return ( 
    <div className="h-screen flex items-center justify-center w-full px-4">
      {children}
    </div>
   );
}
 
export default AuthLayout;