import Head from "@/components/atom/site-heading";
import { AnimatedTestimonials } from "@/components/template/testimonial/source";

export function AnimatedTestimonialsDemo() {
    const testimonials = [
        {
            quote:
                "إلى الشعب السوداني الأصيل في ربوع الوطن بمختلف فئاته وانتماءاته إلى الشباب السوداني خاصة المتطلع نحو الوحدة والنهضة والأمن والازدهار, وكريم القيم والأخلاق",
            name: "البيان التأسيسي",
            designation: "الامانة العامة",
            src: "/paper/foundation-declaration.jpg",
        },
        {
            quote:
                "مبدأ الشوري من أسس قيام الدولة ونظام الحكم فيها فلا يفرض مركز سلطة حاكما او امرا على ناحية دون ارادة اهلها بل الوجب أن يختار اهلها سياسة امرهم مما يليهم ومن يحكمهم بالعدل والقسط",
            name: "الميثاق الاجتماعي",
            designation: "امانة المجتمع",
            src: "/paper/social-contract.jpg",
        },
        {
            quote: "مدرسة الاقتصاد التشاركي قريبة من المزاج السوداني في السودان، يوجد قيمة التضامن ولكن بدلاً من التضامن في الاستهلاك فقط، دعونا نتضامن في الإنتاج أيضًا",
            name: "القطاع الزراعي",
            designation: "امانة الزراعة",
            src: "/paper/agriculture.jpg",
        },
        {
            quote:
                "مدرسة الاقتصاد التشاركي قريبة من المزاج السوداني في السودان، يوجد قيمة التضامن ولكن بدلاً من التضامن في الاستهلاك فقط، دعونا نتضامن في الإنتاج أيضًا",
            name: "الاقتصاد التشاركي",
            designation: "الامانة الاقتصادية",
            src: "/video/f.png",
        },
        {
            quote:
                "أسبقية الدستور على الدولة، وأن تستمد الدولة مشروعيتها وهيئاتها وأسسها من الدستور  بحيث تكون السُلطة الأعلى هي سُلطة المجتمع النازلة في ميثاق الدستور والموجهة للدولة بمؤسساتها كافة",
            name: "بناء الدولة",
            designation: "الامانة السياسية",
            src: "/paper/build.webp",
        },
    ];
    return (
        <div>
            <Head title="الاوراق" description="برامج وتوجهات الحركة" />
            <AnimatedTestimonials testimonials={testimonials} />
        </div>
    );
}
