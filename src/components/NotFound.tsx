import {IconExclamationCircleFilled} from "@tabler/icons-react";

export default function NotFound() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12 selection:bg-wl-red selection:text-white">
            <div className="mb-12">
                <h1 className="text-wl-red text-4xl font-bold mb-6">
                    Betriebsinformation
                </h1>
                <p className="text-wl-dark-gray dark:text-lightmode-white text-xl">
                    Hier finden Sie aktuelle Informationen zu Einschränkungen auf unserer Seite.
                </p>
            </div>

            <div className="flex flex-col xs:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-wl-red text-3xl font-bold">
                    Betriebsinfo
                </h2>
                <button className="bg-gray-100 dark:bg-darkmode-soft-gray rounded-full flex text-sm w-fit">
                    <div className="px-6 py-1.5 rounded-full bg-wl-red text-white flex items-center font-bold">Echtzeit</div>
                    <div className="px-6 py-1.5 text-gray-600 flex items-center font-bold">Geplant</div>
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex shadow-sm dark:shadow-black/40 rounded-sm overflow-hidden mt-4">
                    <div
                        className="w-16 bg-gray-100 dark:bg-darkmode-soft-gray/10 flex-shrink-0 flex flex-col items-center pt-6 relative">
                        <div
                            className="bg-wl-red rounded-xs text-white font-bold w-10 h-10 flex items-center justify-center text-lg z-10">
                            404
                        </div>
                    </div>

                    <div className="flex-1 p-4 md:p-6 relative">
                        <div className="flex items-start gap-4 mb-3">
                            <div className="text-gray-500 mt-0.5">
                                <div className=" rounded p-0.5 inline-block">
                                    <IconExclamationCircleFilled/>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-wl-dark-gray dark:text-lightmode-white mb-2">
                                    Geisterstation: Sie ham sich verfahren
                                </h3>
                                <div
                                    className="text-wl-light-gray dark:text-gray-400 space-y-1 text-sm md:text-base leading-relaxed">
                                    Hearst Oida! De Seitn gibts gar ned, Sie san fix falsch abbogn.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}