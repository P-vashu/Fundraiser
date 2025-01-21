import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="text-white gap-4 flex flex-col justify-center items-center h-[44vh]">
        <div className="font-bold text-5xl flex gap-2 justify-center items-baseline">Buy Me A Chai <span><Image src="/chai1.gif" alt="Not showing" height={44} width={44}  unoptimized={true} /></span></div>
        <p>A crowdfunding platform for creators. Get funded by your fans and followers.</p>
        <div>
          <Link href={"login"}>
          <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Start Here</button>
          </Link>
          <Link href={"/about"}>
          <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Read More</button>
          </Link>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10">
      </div>

      <div className="text-white container mx-auto pb-32 pt-14">
        <h2 className="text-3xl font-bold text-center mb-14">Your fans can buy you a chai</h2>
        <div className="flex gap-5 justify-around">
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image className="bg-slate-400 rounded-full p-6" src="/man1.png" alt="" height={140} width={140}  unoptimized={true} />
            <p className="font-bold">Fund yourself</p>
            <p>Your fans are availabel for you to help</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image className="bg-slate-400 rounded-full p-0" src="/coin2.gif" alt="" height={150} width={150}  unoptimized={true} />
            <p className="font-bold">Fund yourself</p>
            <p>Your fans are availabel for you to help</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image className="bg-slate-400 rounded-full p-2" src="/people.png" alt="" height={140} width={140}  unoptimized={true} />
            <p className="font-bold">Fans wants to help</p>
            <p>Your fans are availabel for you to help</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white h-1 opacity-10">
      </div>

      <div className="text-white container mx-auto pb-32 pt-14 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-center mb-14">Learn more about us</h2>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/7ODrsDrl3qk?si=Op-MFctapU6Dav9X" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
    </>
  );
}
