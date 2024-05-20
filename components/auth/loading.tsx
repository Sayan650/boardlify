import Image from "next/image";

export const Loading = () => {
    return(
        <div className="h-screen w-screen flex flex-col justify-center align-middle items-center">
            <Image
            src="logo.svg"
            alt="Logo"
            width={120}
            height={120}
            className="animate-pulse duration-700 flex justify-center items-center" 
            />
        </div>
    )
}