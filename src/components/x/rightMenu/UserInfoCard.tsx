'use client';
import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/atom/modal/context";
import Modal from "@/components/atom/modal/modal";
import Update from "./update";
import Link from "next/link";

const EditButton = ({ user }: { user: User }) => {``
  const { openModal, modal } = useModal();

  const handleEdit = () => {
    openModal('edit-profile'); // Trigger modal open with 'edit-profile' ID
  };

  return (
    <div className="flex justify-end mt-4 ml-4">
      <Link href='/x/profile/edit'>
      <Button  className="text-sm font-semibold text-[#0077B5] hover:text-[#0076b1] border border-[#0077B5] rounded-full bg-background hover:bg-background">
        تعديل الملف 
      </Button>
      </Link>'
      {/* {modal.open && modal.id === 'edit-profile' && (
        <Modal content={<Update user={user} />} />
      )} */}
    </div>
  );
};

export default EditButton;
