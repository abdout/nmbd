'use client';
import { usePathname } from 'next/navigation';
import { club } from '@/components/template/club/constant';
import React from 'react';
import { Button } from '@/components/ui/button';
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

const ClubById = () => {
    const pathname = usePathname();
    const id = pathname.split("/").pop();

    // Find the club with the matching id
    const currentClub = club.find((c) => c.id === id);

    // If no club is found, return an error message
    if (!currentClub) {
        return (
            <div className="container mx-auto px-4 py-12">
                <h2 className="font-heading text-2xl">Club not found</h2>
                <p className="mt-4">The requested club could not be found.</p>
            </div>
        );
    }

    return (
        <>
            <PageHeader>
                <PageHeaderHeading>{currentClub.name}</PageHeaderHeading>
                <PageHeaderDescription>
                    {currentClub.description || 'A community club for collaboration and learning.'}
                </PageHeaderDescription>
                <PageActions>
                    <Button asChild size="sm">
                        <Link href="#club-content">متابعة</Link>
                    </Button>
                    {currentClub.website && (
                        <Button asChild variant="ghost" size="sm">
                            <Link href={currentClub.website} target="_blank" rel="noopener noreferrer">
                                اقتراح
                            </Link>
                        </Button>
                    )}
                </PageActions>
            </PageHeader>

            <div id="club-content" className="border-grid scroll-mt-24 border-b">
                <div className="">
                    <div className="container py-4">
                        <Tabs dir="rtl" defaultValue="readme" className="w-full text-[16px]">
                            {/* <ScrollArea className="w-full"> */}
                                <TabsList dir="rtl" className="inline-flex h-10 items-center justify-end rounded-md bg-background gap-2 p-1 text-muted-foreground">
                                    <TabsTrigger value="readme">دليل</TabsTrigger>
                                    <TabsTrigger value="head-unit">مكتب</TabsTrigger>
                                    <TabsTrigger value="projects">مشروع</TabsTrigger>
                                    <TabsTrigger value="tasks">مهمة</TabsTrigger>
                                    <TabsTrigger value="dissections">نقاش</TabsTrigger>
                                </TabsList>
                            {/* </ScrollArea> */}

                            <TabsContent value="readme" className="mt-6">
                                <h3 className="text-xl font-semibold mb-4">About {currentClub.name}</h3>
                                <div className="prose max-w-none">
                                    {currentClub.readme || 'No readme information available.'}
                                </div>
                            </TabsContent>

                            <TabsContent value="head-unit" className="mt-6">
                                <h3 className="text-xl font-semibold mb-4">Head Unit</h3>
                                {currentClub.headUnit ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {currentClub.headUnit.map((member, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <h4 className="font-medium">{member.name}</h4>
                                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No head unit information available.</p>
                                )}
                            </TabsContent>

                            <TabsContent value="projects" className="mt-6">
                                <h3 className="text-xl font-semibold mb-4">Projects</h3>
                                {currentClub.projects && currentClub.projects.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {currentClub.projects.map((project, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <h4 className="font-medium">{project.name}</h4>
                                                <p className="text-sm text-muted-foreground">{project.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No projects available.</p>
                                )}
                            </TabsContent>

                            <TabsContent value="tasks" className="mt-6">
                                <h3 className="text-xl font-semibold mb-4">Tasks</h3>
                                {currentClub.tasks && currentClub.tasks.length > 0 ? (
                                    <div className="space-y-4">
                                        {currentClub.tasks.map((task, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <h4 className="font-medium">{task.title}</h4>
                                                <p className="text-sm text-muted-foreground">{task.description}</p>
                                                <div className="mt-2 flex items-center">
                                                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                                        {task.status || 'No status'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No tasks available.</p>
                                )}
                            </TabsContent>

                            <TabsContent value="dissections" className="mt-6">
                                <h3 className="text-xl font-semibold mb-4">Dissections</h3>
                                {currentClub.dissections && currentClub.dissections.length > 0 ? (
                                    <div className="space-y-4">
                                        {currentClub.dissections.map((dissection, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <h4 className="font-medium">{dissection.title}</h4>
                                                <p className="text-sm text-muted-foreground">{dissection.description}</p>
                                                <div className="mt-2">
                                                    <time className="text-xs text-muted-foreground">
                                                        {dissection.date || 'No date'}
                                                    </time>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No dissections available.</p>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
            <div className="container-wrapper flex-1 py-8">
                {/* Additional content or footer information can go here */}
            </div>
        </>
    );
};

export default ClubById;