'use client';
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Icon } from '@iconify/react';
import RepositoryCard from './card';
import { useModal } from "@/components/atom/modal/context";
import Modal from "@/components/atom/modal/modal";
import RepositoryForm from "@/components/platform/repository/form";
import { getRepositories, deleteRepository } from "./action";
import { SuccessToast, ErrorToast, DeleteToast } from "@/components/atom/toast";
import Loading from "@/components/atom/loading";
import { Repository } from './type';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

const RepositoryContent: React.FC = () => {
    const { modal, openModal, closeModal } = useModal();
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [editingRepositoryId, setEditingRepositoryId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, repositoryId: string | null }>({ x: 0, y: 0, repositoryId: null });
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [repositoryToDelete, setRepositoryToDelete] = useState<string | null>(null);

    const fetchRepositories = async () => {
      try {
        setIsLoading(true);
        const result = await getRepositories();
        if (result.repositories) {
          // Transform the data to match Repository type
          const transformedRepositories = result.repositories.map(repo => ({
            ...repo,
            updatedAt: repo.updatedAt instanceof Date ? repo.updatedAt : new Date(repo.updatedAt)
          }));
          setRepositories(transformedRepositories);
        }
      } catch (error) {
        ErrorToast("Failed to fetch repositories");
        console.error("Error fetching repositories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
        fetchRepositories();
    }, []);

    const handleRightClick = (e: React.MouseEvent, repositoryId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, repositoryId });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ x: 0, y: 0, repositoryId: null });
    };

    const handleCloseModal = () => {
        closeModal();
        setEditingRepositoryId(null);
        fetchRepositories();
    };

    const confirmDelete = (repositoryId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setRepositoryToDelete(repositoryId);
        setShowDeleteAlert(true);
        handleCloseContextMenu();
    };

    const handleDeleteRepository = async () => {
        if (repositoryToDelete) {
            try {
                setIsLoading(true);
                await deleteRepository(repositoryToDelete);
                DeleteToast();
                fetchRepositories();
            } catch (error) {
                ErrorToast("Failed to delete repository");
                console.error("Error deleting repository:", error);
            } finally {
                setIsLoading(false);
                setShowDeleteAlert(false);
                setRepositoryToDelete(null);
            }
        }
    };

    const handleEditRepository = (repositoryId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault(); // Prevent navigation
        setEditingRepositoryId(repositoryId);
        openModal(null);
        handleCloseContextMenu();
    };

    const repositoryToEdit = editingRepositoryId ? repositories.find(repo => repo.id === editingRepositoryId) || null : null;

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            {modal.open && <Modal content={<RepositoryForm onClose={handleCloseModal} repositoryToEdit={repositoryToEdit || undefined} />} />}
            
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-right">هل أنت متأكد؟</AlertDialogTitle>
                        <AlertDialogDescription className="text-right">
                            يمكن استرجاع المستوع خلال 14 يوم <br/> او سيحذف تلقائيا للابد
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse sm:justify-start">
                        <AlertDialogAction 
                            onClick={handleDeleteRepository}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            حذف
                        </AlertDialogAction>
                        <AlertDialogCancel onClick={() => setRepositoryToDelete(null)}>
                            إلغاء
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {repositories.map((repository) => (
                    <div key={repository.id}
                        onContextMenu={(e) => handleRightClick(e, repository.id)}
                        className="relative"
                    >
                        <Link href={`/repository/${repository.id}`}
                            onClick={(e) => {
                                if (contextMenu.repositoryId === repository.id) {
                                    e.preventDefault();
                                }
                            }}
                            className="w-full block"
                        >
                            <div className={`relative flex items-center justify-center w-full ${contextMenu.repositoryId === repository.id ? 'opacity-80' : ''}`}>
                                <RepositoryCard repository={repository} />
                            </div>
                        </Link>
                        
                        {contextMenu.repositoryId === repository.id && (
                            <div
                                className="absolute top-0 left-0 w-full h-full flex gap-4 justify-center items-center bg-transparent"
                                onMouseLeave={handleCloseContextMenu}
                            >
                                <button 
                                    onClick={(e) => repository.id && confirmDelete(repository.id, e)}
                                    disabled={isLoading}
                                    className="z-10"
                                >
                                    <Icon icon="ant-design:delete-filled" width={40} />
                                </button>
                                <button 
                                    onClick={(e) => repository.id && handleEditRepository(repository.id, e)} 
                                    className="flex gap-4 z-10"
                                    disabled={isLoading}
                                >
                                    <Icon icon="icon-park-solid:edit" width={40} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                <div className="h-52 md:-mr-4 md:ml-4">
                    <button
                        className="w-full h-full p-6 md:mx-[18px] border rounded-md flex flex-col items-center justify-center hover:border-primary opacity-70 hover:opacity-100"
                        onClick={() => {
                            setEditingRepositoryId(null);
                            openModal(null);
                        }}
                        disabled={isLoading}
                    >
                        <Icon icon="ph:plus-thin" width={70} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default RepositoryContent;
