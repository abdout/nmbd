import { Separator } from "@radix-ui/react-separator";
import TrendingItem from "./news-item";


const Tranding = () => {
  return (
    <div className="px-6 py-4 mt-4 w-[250px]  rounded-sm">
      <div className="h-[25px] text-[16px] font-semibold flex text-right w-full">
        الحاصل شنو
      </div>
      <Separator className='w-[250px] -mx-6 my-2'/>
      
      <TrendingItem
        category="الكوليرا"
        time="لليلة امس "
        title="أعلنت وزارة الصحة الاتحادية رسميا عن تفشي مرض الكوليرا"
        trendingWith="#الاطباء"
      />
      <Separator className='w-[250px] -mx-6 my-2'/>
      
      <TrendingItem
        category="السودان"
        time=" 4 س"
        title="الجيش السوداني يواصل تقدمه وسط العاصمة الخرطوم ويصل منتزه المقرن"
        trendingWith="#السودان"
        imageUrl="https://via.placeholder.com/71x69"
      />
      <Separator className='w-[250px] -mx-6 my-2'/>
      
      <div className="h-[25px] text-sm text-[#0077B5] font-medium py-2 px-2 text-right">
        المزيد
      </div>
    </div>
  );
};

export default Tranding;