'use client';
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Icon } from '@iconify/react';
import RepositoryCard from './card';
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/atom/modal/context";
import Modal from "@/components/atom/modal/modal";
import RepositoryForm from "@/components/platform/repository/form";
import { getRepositories, deleteRepository } from "./action";
import { toast } from "sonner";

interface Repository {
  id: string;
  title: string;
  desc: string;
  club: string;
  status: string;
  readme: string;
  roadmap: string;
  contributor: string;
  material: string;
  chat: string;
  issues: any[];
}

const RepositoryContent: React.FC = () => {
    const { modal, openModal, closeModal } = useModal();
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [editingRepositoryId, setEditingRepositoryId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, repositoryId: string | null }>({ x: 0, y: 0, repositoryId: null });
    const [isLoading, setIsLoading] = useState(false);

    const fetchRepositories = async () => {
      try {
        setIsLoading(true);
        const result = await getRepositories();
        if (result.repositories) {
          setRepositories(result.repositories);
        }
      } catch (error) {
        toast.error("Failed to fetch repositories");
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

    const handleDeleteRepository = async (repositoryId: string | null, e: React.MouseEvent) => {
        e.stopPropagation();
        if (repositoryId) {
            try {
                setIsLoading(true);
                await deleteRepository(repositoryId);
                toast.success("Repository deleted successfully");
                fetchRepositories();
            } catch (error) {
                toast.error("Failed to delete repository");
                console.error("Error deleting repository:", error);
            } finally {
                setIsLoading(false);
                handleCloseContextMenu();
            }
        }
    };

    const handleEditRepository = (repositoryId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingRepositoryId(repositoryId);
        openModal(null);
        handleCloseContextMenu();
    };

    const repositoryToEdit = editingRepositoryId ? repositories.find(repo => repo.id === editingRepositoryId) : null;

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <>
            {modal.open && <Modal content={<RepositoryForm onClose={handleCloseModal} />} />}
            
            <div className="items-center justify-center pr-10 pb-20">
                <div className="grid md:grid-cols-4 md:gap-x-60 gap-y-6 md:gap-y-8 md:-mx-12">
                    {repositories.map((repository) => (
                        <div key={repository.id}
                            onContextMenu={(e) => handleRightClick(e, repository.id)}
                        >
                            <Link href={`/repository/${repository.id}`} onClick={(e) => {
                                if (contextMenu.repositoryId === repository.id) {
                                    e.preventDefault();
                                }
                            }}>
                                <div className={`relative flex items-center justify-center w-60 ${contextMenu.repositoryId === repository.id ? 'opacity-80' : ''}`}
                                    onClick={(e) => {
                                        if (contextMenu.repositoryId === repository.id) {
                                            e.stopPropagation();
                                        }
                                    }}
                                >
                                    <RepositoryCard repository={repository} />
                                    {contextMenu.repositoryId === repository.id && (
                                        <div
                                            className="absolute top-0 left-0 w-full h-full flex gap-4 justify-center items-center bg-transparent"
                                            onMouseLeave={handleCloseContextMenu}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button 
                                                onClick={(e) => handleDeleteRepository(repository.id, e)}
                                                disabled={isLoading}
                                            >
                                                <Icon icon="ant-design:delete-filled" width={40} />
                                            </button>
                                            <button 
                                                onClick={(e) => handleEditRepository(repository.id, e)} 
                                                className="flex gap-4"
                                                disabled={isLoading}
                                            >
                                                <Icon icon="icon-park-solid:edit" width={40} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    ))}

                    <div className="h-52 w-52">
                        <button
                            className="w-full h-full p-6 mx-[18px] border rounded-md flex flex-col items-center justify-center hover:border-primary opacity-70 hover:opacity-100"
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
            </div>
        </>
    );
};

export default RepositoryContent;
