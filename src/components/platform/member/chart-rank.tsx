// "use client";
// import * as React from "react";
// import { TrendingUp } from "lucide-react";
// import { Label, Pie, PieChart } from "recharts";

// import {
//     Card,
//     CardContent,
//     CardFooter,
//     // CardHeader,
//     // CardTitle,
// } from "@/components/ui/card";
// import {
//     // ChartConfig,
//     ChartContainer,
//     ChartTooltip,
//     ChartTooltipContent,
// } from "@/components/ui/chart";


// // const chartConfig = {
// //     professor: {
// //         label: "أستاذ",
// //         color: "hsl(var(--chart-1))",
// //     },
// //     master: {
// //         label: "ماجستير",
// //         color: "hsl(var(--chart-2))",
// //     },
// //     bsc: {
// //         label: "بكالوريوس",
// //         color: "hsl(var(--chart-3))",
// //     },
// //     diploma: {
// //         label: "دبلوم",
// //         color: "hsl(var(--chart-4))",
// //     },
// // } satisfies ChartConfig;


// export function ChartRank() {
//     const professorCount = 200;
//     const masterCount = 150;
//     const bscCount = 250;
//     const diplomaCount = 100;
//     const chartData = [
//         { rank: "أستاذ", count: professorCount, fill: "var(--color-professor)" },
//         { rank: "ماجستير", count: masterCount, fill: "var(--color-master)" },
//         { rank: "بكالوريوس", count: bscCount, fill: "var(--color-bsc)" },
//         { rank: "دبلوم", count: diplomaCount, fill: "var(--color-diploma)" },
//     ];
//     const totalMembers = professorCount + masterCount + bscCount + diplomaCount;
//     const chartConfig = {
//         professor: {
//             label: "أستاذ",
//             color: "hsl(var(--chart-1))",
//         },
//         master: {
//             label: "ماجستير",
//             color: "hsl(var(--chart-2))",
//         },
//         bsc: {
//             label: "بكالوريوس",
//             color: "hsl(var(--chart-3))",
//         },
//         diploma: {
//             label: "دبلوم",
//             color: "hsl(var(--chart-4))",
//         },
//     };

//     return (
//         <Card className="flex flex-col">
//             <CardContent className="w-60 h-60">
//                 <ChartContainer
//                     config={chartConfig}
//                     className="mx-auto aspect-square max-h-[250px]"
//                 >
//                     <PieChart>
//                         <ChartTooltip
//                             cursor={false}
//                             content={<ChartTooltipContent hideLabel />}
//                         />
//                         <Pie
//                             data={chartData}
//                             dataKey="count"
//                             nameKey="rank"
//                             innerRadius={50}
//                             strokeWidth={10}
//                         >
//                             <Label
//                                 content={({ viewBox }) => {
//                                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                                         return (
//                                             <text
//                                                 x={viewBox.cx}
//                                                 y={viewBox.cy}
//                                                 textAnchor="middle"
//                                                 dominantBaseline="middle"
//                                             >
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={viewBox.cy}
//                                                     className="fill-foreground text-2xl font-bold"
//                                                 >
//                                                     {totalMembers.toLocaleString()}
//                                                 </tspan>
//                                                 <tspan
//                                                     x={viewBox.cx}
//                                                     y={(viewBox.cy || 0) + 24}
//                                                     className="fill-muted-foreground"
//                                                 >
//                                                     عضو
//                                                 </tspan>
//                                             </text>
//                                         );
//                                     }
//                                 }}
//                             />
//                         </Pie>
//                     </PieChart>
//                 </ChartContainer>
//             </CardContent>
//             <CardFooter className="flex-col gap-2 text-sm -mt-12">
//                 <div className="flex items-center gap-2 font-medium leading-none">
//                     درجة البكالريوس 60% <TrendingUp className="h-4 w-4" />
//                 </div>
//                 <div className="leading-none text-muted-foreground">
//                     توزيع الدرجات
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// }
