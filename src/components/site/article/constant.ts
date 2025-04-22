import { ArticleItem, author } from "./type";

export const articles: ArticleItem[] = [
  {
    title: "لماذا تحارب الإمارات السودان ؟",
    description: "التدابير السياسية وحدها لا تكفي ليخرج السودان من هذه الحفرة، ولكن السودان يحتاج ايضا إلى إصلاح ثقافي",
    link: "/article/f",
    videoId: "L0SdBSe_ofc",
    image: "/article/f.jpg",
    date: "18 ابريل 2024",
    author: "ابو بكر جيكوني"
  },
  {
    title: "قراءة في كتاب لماذا يكذب القادة؟",
    description: "القبيلة والجهة مخزن قسم كريمة ومساحة تربية فاضلة, يحثان على التراحم والتعارف بين الناس",
    link: "/article/b",
    videoId: "c4LI934B_-M",
    image: "/article/b.jpg",
    date: "14 ابريل 2024",
    author: "الفاضل فرح"
  },
  {
    title: "من قورباتشوف إلى ترامب: قراءة في نهاية الإمبراطوريات",
    description: "القبيلة والجهة مخزن قسم كريمة ومساحة تربية فاضلة, يحثان على التراحم والتعارف بين الناس",
    link: "/article/c",
    videoId: "c4LI934B_-M",
    image: "/article/c.jpg",
    date: "08 فبراير 2025",
    author: "محمد ابو بكر"
  },
  {
    title: "الثناء لله تعالى على النصر المؤزر",
    description: "في السودان، يوجد قيمة التضامن ولكن بدلاً من التضامن في الاستهلاك فقط، دعونا نتضامن في الإنتاج أيضًا",
    link: "/article/d",
    videoId: "yjSIrCLQL9U",
    image: "/article/d.jpg",
    date: "14 ابريل 2024",
    author: "قاسم الظافر"
  }
];

export const featuredArticles = (count: number = 4) => {
  return articles.slice(0, count);
};

export const authors: author[] = [
  {
    value: "الحركة الوطنية",
    label: "الحركة الوطنية",
    image: "/author/nmbd.png"
  },
  {
    value: "المقداد الهجان",
    label: "المقداد الهجان",
    image: "/author/almgdad.png"
  },
  {
    value: "هشام احمد",
    label: "هشام احمد",
    image: "/author/hesham.png"
  },
  {
    value: "قاسم الظافر",
    label: "قاسم الظافر",
    image: "/author/gasm.png"
  },
  {
    value: "ابو بكر جيكوني",
    label: "ابو بكر جيكوني",
    image: "/author/hesham.png"
  },
]