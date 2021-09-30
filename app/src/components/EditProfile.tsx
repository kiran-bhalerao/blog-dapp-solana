import { Popover, Transition } from "@headlessui/react";
import { omit } from "lodash-es";
import { FC, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { Button } from "src/components/Button";
import { useBlog } from "src/context/Blog";

interface EditProfileProps {
  name: string;
}

export const EditProfile: FC<EditProfileProps> = ({ name: oldName }) => {
  const referenceElementRef = useRef<any>();
  const popperElementRef = useRef<any>();
  const { styles, attributes } = usePopper(
    referenceElementRef.current,
    popperElementRef.current
  );

  const { updateUser } = useBlog();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(oldName);

  const onUpdateProfile = async () => {
    setLoading(true);
    await updateUser(name);
    setLoading(false);
  };

  return (
    <Popover className="relative">
      {({ open }) => {
        return (
          <>
            <Popover.Button ref={referenceElementRef}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </Popover.Button>

            <Transition
              show={open}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-8"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Popover.Panel
                ref={popperElementRef}
                style={{
                  ...omit(styles.popper, ["transform", "left", "top"]),
                  right: 0,
                }}
                {...attributes.popper}
                className="absolute bottom-8 z-20 transform transition-all"
              >
                <div className="glass rounded-xl shadow-xl py-4 px-6 flex flex-col">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Your lovely name"
                    className="bg-white rounded-3xl h-10 px-4"
                  />
                  <Button
                    loading={loading}
                    onClick={onUpdateProfile}
                    className="w-full mt-3"
                  >
                    Save
                  </Button>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        );
      }}
    </Popover>
  );
};
