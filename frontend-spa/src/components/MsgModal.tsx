import { Button } from "./ui/Button";
import { X } from "lucide-react";

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const MsgModal = ({ onClose, onSuccess }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md animate-scale-in overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Continuar compra
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center text-gray-700 text-base">
          Notamos que ya estás en proceso de una compra. <br />
          ¿Te gustaría continuar?
        </div>

        <div className="flex justify-center gap-4 p-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            className="flex-1 py-2 bg-white text-black! shadow shadow-gray-400"
          >
            No
          </Button>
          <Button onClick={onSuccess} className="flex-1 py-2">
            Sí
          </Button>
        </div>
      </div>
    </div>
  );
};
