import Image from "next/image";
import image from "@/images/construction.png";

export const BetaView = () => {
  return (
    <div>
      <div
        style={{
          position: "fixed",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
        className={"-z-10 bg-gradient-to-t from-yellow-200"}
      >
        <Image
          alt="construction image"
          src={image}
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <p
        style={{
          margin: "0",
          textAlign: "center",
          paddingTop: "20vh",
          textShadow: "1px 1px 1px #3c5c5e",
        }}
        className={
          "z-40 text-4xl font-bold text-white bg-stone-600/40 h-full tracking-widest"
        }
      >
        WORK IN
        <br />
        PROGRESS
      </p>
    </div>

    // <div className="flex h-full">
    //   <div className="relative bg-gradient-to-b from-yellow-100">
    //     <Image priority src={image} alt="Waiting Image" layout="responsive" />
    //     <h1 className="mb-16 text-2xl">DAO Governance</h1>
    //     <p className="mb-5 text-5xl uppercase tracking-widest">
    //       {" "}
    //       <span className="text-yellow-400"></span> coming soon
    //     </p>
    //     <p className="mb-7 text-sm leading-snug text-yellow-400">
    //       Lorem Ipsum is simply dummy text of the printing and typesetting
    //       industry. Lorem Ipsum has been the industrys standard dummy text ever
    //       since the 1500s, when an unknown printer took a galley of type and
    //       scrambled it to make a type specimen book.
    //     </p>
    //   </div>
    // </div> style={position: "fixed", height: "100vh", width: "100vw", overflow: "hidden", z-index: "-1"}
  );
};
