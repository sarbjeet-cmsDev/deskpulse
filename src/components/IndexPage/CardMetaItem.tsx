interface CardMetaTagProps {
  date?: string;
}

export default function CardMetaTag({ date }: CardMetaTagProps){
    return(
        <div className="flex items-center gap-2 bg-[#f6f5f7] rounded-[12px] px-[12px] py-[4px] inline">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
                className="w-4 h-4"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="#808492"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
            <span className="text-[#808492] text-[10px]">
                 {date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
            </span>
        </div>
    );
}