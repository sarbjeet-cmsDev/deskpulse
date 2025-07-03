import { ReactNode } from 'react';
import { ReduxProvider } from '@/app/admin/adminProvider';
import AdminProtectedRoute from '@/app/admin/ProtectedRoutes/AdminProtectedRoute';
// import Sidebar from '../../../components/admin/AdminSideBar';
// import AdminNavbar from '../../../components/admin/AdminNavbar';


interface Props {
  children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  return (
    <AdminProtectedRoute>
       <ReduxProvider>
   
          <div className="flex">
            {/* <Sidebar /> */}
            <div className="flex flex-col flex-1">
              {/* <AdminNavbar /> */}
              <main className="p-4">{children}</main>
            </div>
          </div>
      </ReduxProvider>
    </AdminProtectedRoute>
  );
};

export default AdminLayout;