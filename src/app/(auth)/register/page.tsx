'use client';
import React from 'react';
import { MemberProvider } from '@/components/platform/member/context';
import { UploadProvider } from '@/components/upload/context';
import Create from '@/components/platform/member/create';


const Register = () => {

  return (
    
      <UploadProvider>
        <MemberProvider>
          <div>
            <Create />
          </div>
        </MemberProvider>
      </UploadProvider>
    
  );
};

export default Register;
