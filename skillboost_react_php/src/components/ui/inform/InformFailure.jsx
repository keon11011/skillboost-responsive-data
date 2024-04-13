import Triangle_Warning from '../../icons/Warning/TriangleWarning';

const InformFailure = ({children}) => {
  return (
    <div className="flex fixed top-[24px] w-screen justify-center items-center">
        <div className="bg-sematic-red gap-2 px-7 py-4 border body-large text-white rounded-[8px] p-10 shadow-2xl">
        <Triangle_Warning
          width="24px"
          height="24px"
        />
        {children}
      </div>
    </div>
  )
}

export default InformFailure