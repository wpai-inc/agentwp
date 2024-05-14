
export default function Check({ checked }: { checked: boolean}) {
    return (
        <>
            {!checked && <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0C3.15 0 0 3.15 0 7C0 10.85 3.15 14 7 14C10.85 14 14 10.85 14 7C14 3.15 10.85 0 7 0ZM7 12.6C3.913 12.6 1.4 10.087 1.4 7C1.4 3.913 3.913 1.4 7 1.4C10.087 1.4 12.6 3.913 12.6 7C12.6 10.087 10.087 12.6 7 12.6ZM10.213 3.906L5.6 8.519L3.787 6.713L2.8 7.7L5.6 10.5L11.2 4.9L10.213 3.906Z"
                      fill="#1E1E1E" />
            </svg>}
            {checked && <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 0C3.15 0 0 3.15 0 7C0 10.85 3.15 14 7 14C10.85 14 14 10.85 14 7C14 3.15 10.85 0 7 0ZM5.6 10.5L2.1 7L3.087 6.013L5.6 8.519L10.913 3.206L11.9 4.2L5.6 10.5Z" fill="#1E1E1E" />
            </svg>}
        </>
    )
        ;
}
