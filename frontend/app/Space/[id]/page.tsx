"use client";

import { useEffect, useState } from "react";
import NoHelloUser from "../../components/NoHelloUser";
import MainTab from "../../components/MainTab";
import styles from "./Space.module.css";
import Link from "next/link";
import EditableTag from "../../components/EditableTag";
import Image from "next/image";
import { apiClient } from "../../utils/api";
import { useRouter } from "next/router";
import FolderDisplay from "@/app/components/Folder.module";
interface Group {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Space {
  id: number;
  group: Group;
  tags: Tag[];
  name: string;
  description: string;
  created_at: string; // This could also be of type Date if you're converting strings to Date objects
  owner: number; // Assuming 'owner' refers to the user ID, but you can change the type if needed
}

const Chats = ({ params }) => {
  const [loading, setLoading] = useState(false); // S
  const [space, setSpace] = useState<Space>();

  useEffect(() => {
    // You can use the 'id' here
    if (params.id) {
      apiClient
        .get(`/spaces/${params.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
        })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setSpace(data);
          setLoading(false); // Stop loading after the data is received
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false); // Stop loading after the data is received
        });
    }
  }, []);

  return (
    <main>
      {/* <div className={styles.maintab}><MainTab></MainTab></div> */}
      <div className={styles.title}>
        <h1>{space?.name}</h1>
      </div>
      <div className={styles.FirRec}>
        <div className={styles.left}>
          <div className={styles.tags}>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              src="/space/tags.png"
              className={styles.pic}
              alt="tags"
            />
            <p>&nbsp;&nbsp;Tags: </p>

            <EditableTag
              initialText={`T-${space?.tags[0]?.name}`}
            ></EditableTag>
          </div>
          <br></br>
          <div className={styles.tags}>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              src="/space/tags.png"
              className={styles.pic}
              alt="tags"
            />
            <p>&nbsp;&nbsp;Groups: </p>

            <div className={styles.time}>
              <p>{space?.group.name}</p>
            </div>
          </div>
          <div className={styles.createdAt}>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              src="/space/createdAt.png"
              className={styles.pic}
              alt="created at"
            />
            <p>&nbsp;&nbsp;Created At</p>
            <div className={styles.time}>
              <p>{space?.created_at}</p>
            </div>
          </div>
        </div>
        <div className={styles.description}>
          <h2 style={{ fontWeight: "bold" }}>Description</h2>
          <div style={{ width: "50%" }}>{space?.description}</div>
        </div>
      </div>

      <div className={styles.spaceBackground}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          src="/process/background2.png"
          alt="process"
        />
      </div>
      <NoHelloUser></NoHelloUser>

      <div className={styles.SecRec}>
        <div className={styles.chatwithTag}>
          <h2 style={{ fontWeight: "bold" }}>Folders</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FolderDisplay text="Folder 1 " date={space?.created_at} />
            <FolderDisplay text="Folder 2 " date={space?.created_at} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Chats;
