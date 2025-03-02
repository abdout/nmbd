"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { 
  Label, 
  ResponsiveContainer, 
  Treemap,
  Tooltip as RechartsTooltip 
} from "recharts";

const assetAllocationData = [
  {
    name: "نفقات الحملات",
    children: [
      { name: "الإعلانات", size: 4000 },
      { name: "الفعاليات", size: 3000 },
      { name: "المنشورات", size: 2000 },
      { name: "التواصل الاجتماعي", size: 1000 },
    ],
  },
  {
    name: "النفقات التشغيلية",
    children: [
      { name: "الرواتب", size: 3000 },
      { name: "إيجار المقرات", size: 2000 },
      { name: "المعدات والتقنية", size: 1000 },
    ],
  },
  {
    name: "أنشطة الحزب",
    children: [
      { name: "المؤتمرات", size: 2000 },
      { name: "التدريب", size: 1500 },
    ],
  },
  {
    name: "الاحتياطي",
    children: [
      { name: "احتياطي الطوارئ", size: 1000 },
      { name: "الاستثمارات", size: 500 },
    ],
  },
];

// Custom content for properly positioning RTL text with multi-line support
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, depth, name, root, index } = props;
  
  // Function to render text with multi-line support
  const renderText = () => {
    // Check if name exists to prevent errors
    if (!name) return null;
    
    // If the name contains a space, split it into words
    const words = name.split(' ');
    
    if (words.length > 1 && width > 40 && height > 40) {
      // Return multi-line text for multiple words
      return words.map((word: string, i: number) => (
        <text
          key={i}
          x={x + width / 2}
          y={y + height / 2 + (i - (words.length - 1) / 2) * 16}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={11}
          fontWeight="bold"
          style={{ direction: 'rtl' }}
        >
          {word}
        </text>
      ));
    } else {
      // Return single line text
      return (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
          style={{ direction: 'rtl', textAlign: 'center' }}
        >
          {name}
        </text>
      );
    }
  };
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: "#8884d8",
          stroke: "#fff",
          strokeWidth: 2,
        }}
      />
      {width > 30 && height > 30 && name && renderText()}
    </g>
  );
};

// Custom tooltip component
const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  
  if (active && payload && payload.length && payload[0]?.name) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow" dir="rtl">
        <p className="font-bold">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const TreeMap = () => {
  return (
    <Card className="bg-purple-50 rounded-lg">
      <CardHeader>
        <CardTitle>توزيع النفقات</CardTitle>
        <CardDescription>
          عرض هرمي لكيفية توزيع نفقات الحزب
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <Treemap
            data={assetAllocationData}
            dataKey="size"
            aspectRatio={4 / 3}
            content={<CustomTreemapContent />}
          >
            <RechartsTooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TreeMap;
