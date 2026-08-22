import UsersTable from './users-table';

export default function UsersView({ currentRole, isAdmin }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, permissions, and storage allocations.
          </p>
        </div>
      </div>
      <UsersTable currentRole={currentRole} isAdmin={isAdmin} />
    </div>
  );
}
