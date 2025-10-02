import Image from "next/image";
import styles from "./page.module.css";
import VCardViewer from "../../components/VcardViewer";
import BulkNumberToVCard from "../../components/BulkNumToVcard/BulkNumToVcard";
import BulkNumberNameVCard from "../../components/BulkNumberNameVCard/BulkNumberNameVCard";
import BulkWhatsAppSender from "../../components/BulkWhatsAppSender/BulkWhatsAppSender";

export default function Home() {
  return (
    <div className={styles.page}>
      <VCardViewer />
      <BulkNumberToVCard />
      <BulkNumberNameVCard />
      <BulkWhatsAppSender />
    </div>
  );
}
