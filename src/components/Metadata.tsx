"use client";

import EditMetadataForm from "@/components/EditMetadataForm";
import NotesList from "@/components/NotesList";
import { URI, useNostr } from "@/providers/NostrProvider";
export interface Metadata {
  name?: string;
  about?: string;
  picture?: string;
  nip05?: string;
  pubkey: string;
  npub?: string;
}

export default function Metadata({ uri }: { uri: URI }) {
  const { subscribeToProfiles, profiles, notesByURI, subscribeToNotesByURI } =
    useNostr();
  subscribeToNotesByURI([uri]);
  subscribeToProfiles((notesByURI[uri] || []).map((e) => e.pubkey));

  const latestNote =
    notesByURI[uri] && notesByURI[uri][notesByURI[uri].length - 1];
  const description = latestNote?.content;
  const tags = latestNote?.tags;

  return (
    <div className="app">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <div className="flex flex-col gap-2">
            <h2>Description</h2>
            <p>{description}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2>Tags</h2>
            <p>{tags?.join(", ")}</p>
          </div>
        </div>
        <EditMetadataForm uri={uri} content={description} tags={tags} />
        <h2>History</h2>
        <NotesList profiles={profiles} notes={notesByURI[uri]} />
      </div>
    </div>
  );
}
