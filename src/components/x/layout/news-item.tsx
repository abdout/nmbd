interface TrendingItemProps {
    category: string;
    time: string;
    title: string;
    trendingWith: string;
    imageUrl?: string;
  }
  
  const TrendingItem: React.FC<TrendingItemProps> = ({ category, time, title, trendingWith, imageUrl }) => {
    return (
      <div className=" justify-start items-start gap-[15px] inline-flex">
        <div className="flex-col justify-start items-start gap-1.5 inline-flex">
          <div className="justify-start items-start gap-1 inline-flex">
            <div className="text-[#5b7083] text-[12px] font-medium font-['SF Compact Display']">{category}</div>
            <div className="text-[#5b7083] text-[12px] font-medium font-['SF Compact Display']">·</div>
            <div className="text-[#5b7083] text-[12px] font-medium font-['SF Compact Display']">{time}</div>
          </div>
          <div className="w-[200px] text-[#0f1419] text-[13px] font-medium ">
            {title}
          </div>
          <div className="justify-start items-start gap-1 inline-flex">
            <div className="text-[#5b7083] text-[12px] font-medium font-['SF Compact Display']">رائج مع</div>
            <div className="text-[#0077B5] text-[12px] font-medium font-['SF Compact Display']">{trendingWith}</div>
          </div>
        </div>
        <div className="w-[71px] h-[69px] justify-center items-center flex">
          {/* <div className="grow shrink basis-0 self-stretch rounded-xl justify-center items-center inline-flex">
            <img className="w-[71px] h-[69px]" src={imageUrl} alt="Trending" />
          </div> */}
        </div>
      </div>
    );
  };
  
  export default TrendingItem;
  