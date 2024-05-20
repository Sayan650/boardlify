import { Navbar } from "./_components/navbar";
import { OrgSidebar } from "./_components/organisatinSidebar";
import Sidebar from "./_components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full">
        {/* <Navbar/> */}
      <Sidebar />
      <div className="pl-[60px] h-full">
        <div className="flex gap-x3 h-full">
            {/*organisation sidebar*/}
            <OrgSidebar/>
          <div className="h-full flex-1">
          <Navbar/>
            {/* Add navbar */}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;