import Check from '../../icons/Interface/Check';

const InformSuccess = ({children}) => {
  return (
    <div className="flex fixed top-[24px] w-screen justify-center items-center">
    <div className="flex bg-sematic-green gap-2 px-7 py-4 border body-large text-white rounded-[8px] p-10 shadow-2xl">
    <Check
      width="24px"
      height="24px"
    />
    {children}
  </div>
</div>
  )
}

export default InformSuccess