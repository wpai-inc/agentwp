export default function SkeletonLoader() {
	return (
		<div className="animate-pulse">
			<div className="bg-gray-300 rounded-md h-6 w-1/3 mb-4"></div>
			<div className="bg-gray-300 rounded-md h-4 w-2/3 mb-8"></div>
			<div className="grid grid-cols-3 gap-4">
				<div className="bg-gray-300 rounded-md h-32"></div>
				<div className="bg-gray-300 rounded-md h-32"></div>
				<div className="bg-gray-300 rounded-md h-32"></div>
			</div>
		</div>
	);
}
