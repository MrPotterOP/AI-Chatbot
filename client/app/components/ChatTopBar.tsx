'use client';

export default function ChatTopBar({ title, isLoading, status, retry }: { title: string, isLoading: boolean, status: 'connecting' | 'connected' | 'disconnected', retry: () => void }) {


    const ServerStatus = () => {

        const StatusColors = {
            connecting: 'bg-(--clr-yellow)',
            connected: 'bg-(--clr-green)',
            disconnected: 'bg-(--clr-red)',
        }

        return (
            <div className="flex items-center gap-2 border border-(--clr-gray) rounded-xl px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${StatusColors[status]} ${status === 'connecting' ? 'animate-pulse' : ''}`}></div>
                <span className="text-sm text-(--clr-white)/90 capitalize">{status}</span>

                {status === 'disconnected' && <button className="cursor-pointer" onClick={retry}>
                    <span className="text-sm font-semibold text-(--clr-white)/90 underline">Retry</span>
                </button>}
            </div>
        )
    }

    return (
        <section className="pl-14 px-5 py-4 md:px-6 border-b border-(--clr-gray)">
            <div className="flex justify-between items-center gap-4">
                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {
                        isLoading && (
                            <div className="h-5 w-[40vw] bg-(--clr-gray) rounded-md animate-pulse"></div>
                        )
                    }
                    {
                        !isLoading && title && (
                            <span className="text-base">{title}</span>
                        )
                    }
                </div>

                <ServerStatus />
            </div>
        </section>
    );
}