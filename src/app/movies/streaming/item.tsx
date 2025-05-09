import { Content } from "@/data-models/content.interface";
import Image from "next/image";

export const Item = ({data}: { data: Content }) => {
  return (
    <div>
      {Boolean(data?.image_url) && (
        <>
          <Image src={`${data?.image_url}`} alt={data?.name} loading="lazy" width={240} height={240} style={{ width: "20%", height: "auto" }} />
        </>
      )}
      <div>Name: {data?.name}</div>
      {/* <div>Network: {data?.network?.name}</div> */}
      <div>Status: {data?.status}</div>
      Airing:
      {/* {data?.schedule?.days?.map((day: string) => {
        return (
          <div key={day}>
            {day} {data?.schedule?.time}
          </div>
        );
      })} */}
    </div>
  );
};
