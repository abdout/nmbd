import { VideoItem } from "./type";

export const videos: VideoItem[] = [
  {
    title: "ما هي الحركة الوطنية وماذا تريد؟",

    description: "التدابير السياسية وحدها لا تكفي ليخرج السودان من هذه الحفرة، ولكن السودان يحتاج ايضا إلى إصلاح ثقافي",
    link: "L0SdBSe_ofc",
    image: "/video/nmbd.jpg",
    date: "18 ابريل 2024",
    author: "ابو بكر جيكوني"
  },
  {
    title: "عن أهمية الميثاق الاجتماعي",
    description: "القبيلة والجهة مخزن قسم كريمة ومساحة تربية فاضلة, يحثان على التراحم والتعارف بين الناس",
    link: "c4LI934B_-M",
    image: "paper/social-contract.jpg",
    date: "14 ابريل 2024",
    author: "هشام احمد"
  },
  {
    title: "الرؤية الاقتصادية للحركة الوطنية",
    description: "في السودان، يوجد قيمة التضامن ولكن بدلاً من التضامن في الاستهلاك فقط، دعونا نتضامن في الإنتاج أيضًا",
    link: "yjSIrCLQL9U",
    image: "/video/o.jpg",
    date: "14 ابريل 2024",
    author: "قاسم الظافر"
  }
];

export const featuredVideos = (count: number = 3) => {
  return videos.slice(0, count);
};