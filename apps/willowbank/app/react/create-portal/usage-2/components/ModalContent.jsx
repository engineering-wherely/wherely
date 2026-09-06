export default function ModalContent({ onClose }) {
  return (
    <div className="flex items-center bg-red-100 h-30 text-black">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
