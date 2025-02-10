const AuthLayout = ({ 
  children
}: { 
  children: React.ReactNode
}) => {
  return ( 
    <div className="h-screen flex items-center justify-center" dir="rtl">
      {children}
    </div>
   );
}
 
export default AuthLayout;