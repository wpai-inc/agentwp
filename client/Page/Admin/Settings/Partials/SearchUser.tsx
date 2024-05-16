import { Spinner } from "@/Components/Spinner";

export default function SearchUser({searchUsers, searching}: {searchUsers: (value: string) => void, searching: boolean}) {
    return (
        <div className={'flex items-center bg-white rounded-xl px-4 py-2 mt-16 border-2 border-solid border-gray-300'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M8.91429 0C11.2785 0 13.5459 0.939181 15.2176 2.61093C16.8894 4.28269 17.8286 6.55007 17.8286 8.91429C17.8286 11.1223 17.0194 13.152 15.6891 14.7154L16.0594 15.0857H17.1429L24 21.9429L21.9429 24L15.0857 17.1429V16.0594L14.7154 15.6891C13.152 17.0194 11.1223 17.8286 8.91429 17.8286C6.55007 17.8286 4.28269 16.8894 2.61093 15.2176C0.939181 13.5459 0 11.2785 0 8.91429C0 6.55007 0.939181 4.28269 2.61093 2.61093C4.28269 0.939181 6.55007 0 8.91429 0ZM8.91429 2.74286C5.48571 2.74286 2.74286 5.48571 2.74286 8.91429C2.74286 12.3429 5.48571 15.0857 8.91429 15.0857C12.3429 15.0857 15.0857 12.3429 15.0857 8.91429C15.0857 5.48571 12.3429 2.74286 8.91429 2.74286Z"
                    fill="#DDDDDD" />
            </svg>

            <input
                type="text"
                onInput={(ev) => searchUsers(ev.target.value)}
                className={"w-full px-4 shadow-none bg-transparent"}
                placeholder={"Search for a user..."}
            />
            <Spinner show={searching} />
        </div>
    );
}
