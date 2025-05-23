import {
  Avatar as AvatarUI,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  generateAvatar,
  generateURI,
  getAddressFromURI,
  getChainIdFromURI,
  getChainSlugFromChainId,
} from "@/lib/utils";
import { ProfileData } from "@/types";
import { cn } from "@/lib/utils";
import { useNostr } from "@/providers/NostrProvider";
import { useRouter } from "next/navigation";

export default function Avatar({
  profile,
  className,
  editable = true,
}: {
  profile: ProfileData;
  className?: string;
  editable?: boolean;
}) {
  const { openEditProfileModal } = useNostr();
  const router = useRouter();
  const onClick = () => {
    if (editable) {
      openEditProfileModal(profile.uri, profile);
    } else {
      const chainId = getChainIdFromURI(profile.uri);
      const chainName = getChainSlugFromChainId(chainId);
      const address = getAddressFromURI(profile.uri);
      if (chainName && address) {
        router.push(`/${chainName}/address/${address}`);
      }
    }
  };

  return (
    <AvatarUI
      title={profile.name || profile?.address}
      className={cn(
        "h-12 w-12 border-2 border-gray-300",
        className,
        "cursor-pointer hover:ring-2 hover:ring-primary transition-all"
      )}
      onClick={onClick}
    >
      <AvatarImage src={profile?.picture} alt={profile?.address} />
      {profile?.name && (
        <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
      )}
      {!profile?.name && (
        <AvatarFallback>
          <img src={generateAvatar(profile?.address as string)} />
        </AvatarFallback>
      )}
    </AvatarUI>
  );
}
