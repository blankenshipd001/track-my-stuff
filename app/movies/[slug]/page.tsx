"use client"


export default function Page({ params }: { params: { slug: string } }) {

    console.log(params);
    return (
        <div>My Post: {params.slug}</div>
    );


}