import Image from 'next/image';
import { useRouter } from 'next/router';


export default function BottomNavbar() {
	const router = useRouter();
	return (
		<div className="bottomNavBar">
			<div id="hearted" className="nav-link"  onClick={() => router.push('/create')}>
				<Image src="/heart.svg" width="40" height="40" />
			</div>
			<div id="browse" className="nav-link"  onClick={() => router.push('/browse')}>
				<Image src="/stack.svg" width="40" height="40" />
			</div>
			<div id="create" className="nav-link" onClick={() => router.push('/create')}>
				<Image src="/create.svg" width="40" height="40" />
			</div>
		</div>
	);
}