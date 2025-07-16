import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/organisms/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import billingService from "@/services/api/billingService";

const Billing = () => {
  const [billing, setBilling] = useState([]);
  const [filteredBilling, setFilteredBilling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidBills: 0,
    unpaidBills: 0,
    overdueBills: 0
  });

  const loadBilling = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await billingService.getAll();
      setBilling(data);
      setFilteredBilling(data);
      
      // Calculate stats
      const totalRevenue = data.filter(b => b.status === "paid").reduce((sum, b) => sum + b.amount, 0);
      const paidBills = data.filter(b => b.status === "paid").length;
      const unpaidBills = data.filter(b => b.status === "unpaid").length;
      const overdueBills = data.filter(b => b.status === "unpaid" && new Date(b.dueDate) < new Date()).length;
      
      setStats({
        totalRevenue,
        paidBills,
        unpaidBills,
        overdueBills
      });
    } catch (err) {
      setError(err.message || "Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredBilling(billing);
    } else {
      const filtered = billing.filter(bill =>
        bill.studentName.toLowerCase().includes(query.toLowerCase()) ||
        bill.parentName.toLowerCase().includes(query.toLowerCase()) ||
        bill.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
        bill.className.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBilling(filtered);
    }
  };

  const handleRowClick = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };

  const handleMarkAsPaid = async (billId) => {
    if (confirm("Mark this bill as paid?")) {
      try {
        await billingService.markAsPaid(billId, "Cash");
        toast.success("Bill marked as paid");
        loadBilling();
      } catch (err) {
        toast.error("Failed to update bill status");
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      "paid": "success",
      "unpaid": "error",
      "pending": "warning",
      "partial": "warning"
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const isOverdue = (bill) => {
    return bill.status === "unpaid" && new Date(bill.dueDate) < new Date();
  };

  const columns = [
    {
      key: "invoiceNumber",
      label: "Invoice",
      render: (value, bill) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{bill.period}</p>
        </div>
      )
    },
    {
      key: "studentName",
      label: "Student",
      render: (value, bill) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{bill.parentName}</p>
        </div>
      )
    },
    {
      key: "className",
      label: "Class",
      render: (value) => (
        <div className="flex items-center gap-2">
          <ApperIcon name="BookOpen" className="w-4 h-4 text-gray-500" />
          <span className="text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: "amount",
      label: "Amount",
      render: (value) => (
        <div className="text-right">
          <p className="font-medium text-gray-900">${value}</p>
        </div>
      )
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (value, bill) => (
        <div className={isOverdue(bill) ? "text-error-600" : "text-gray-900"}>
          {format(new Date(value), "MMM d, yyyy")}
          {isOverdue(bill) && (
            <div className="text-xs text-error-600 mt-1">Overdue</div>
          )}
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (value, bill) => (
        <div className="flex flex-col gap-1">
          {getStatusBadge(value)}
          {isOverdue(bill) && (
            <Badge variant="error" size="sm">Overdue</Badge>
          )}
        </div>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, bill) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(bill);
            }}
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
          </Button>
          {bill.status === "unpaid" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsPaid(bill.Id);
              }}
              className="text-success-600 hover:text-success-700"
            >
              <ApperIcon name="CheckCircle" className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message="Billing Error" description={error} onRetry={loadBilling} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600">Manage payments and invoices</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Billing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="compact">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-success-600">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>

        <Card variant="compact">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Bills</p>
              <p className="text-2xl font-bold text-gray-900">{stats.paidBills}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card variant="compact">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unpaid Bills</p>
              <p className="text-2xl font-bold text-warning-600">{stats.unpaidBills}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </Card>

        <Card variant="compact">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue Bills</p>
              <p className="text-2xl font-bold text-error-600">{stats.overdueBills}</p>
            </div>
            <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-6 h-6 text-error-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search invoices, students, or classes..."
              onSearch={handleSearch}
              value={searchQuery}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Billing Table */}
      <Card>
        {filteredBilling.length === 0 ? (
          <Empty
            icon="CreditCard"
            title="No billing records found"
            description="Start by creating your first invoice"
            actionLabel="Create Invoice"
            onAction={() => console.log("Create invoice")}
          />
        ) : (
          <DataTable
            data={filteredBilling}
            columns={columns}
            onRowClick={handleRowClick}
          />
        )}
      </Card>

      {/* Bill Details Modal */}
      {showModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Invoice Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Invoice Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedBill.invoiceNumber}</h4>
                    <p className="text-gray-600">{selectedBill.period}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(selectedBill.status)}
                    {isOverdue(selectedBill) && (
                      <div className="mt-1">
                        <Badge variant="error" size="sm">Overdue</Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Student Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Student Information</h5>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Student:</span> {selectedBill.studentName}</p>
                      <p><span className="font-medium">Parent:</span> {selectedBill.parentName}</p>
                      <p><span className="font-medium">Class:</span> {selectedBill.className}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Payment Information</h5>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Amount:</span> ${selectedBill.amount}</p>
                      <p><span className="font-medium">Due Date:</span> {format(new Date(selectedBill.dueDate), "MMMM d, yyyy")}</p>
                      {selectedBill.paidDate && (
                        <p><span className="font-medium">Paid Date:</span> {format(new Date(selectedBill.paidDate), "MMMM d, yyyy")}</p>
                      )}
                      {selectedBill.paymentMethod && (
                        <p><span className="font-medium">Payment Method:</span> {selectedBill.paymentMethod}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Description</h5>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedBill.description}</p>
                </div>

                {/* Amount Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span>${selectedBill.amount}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                {selectedBill.status === "unpaid" && (
                  <Button 
                    variant="success" 
                    onClick={() => {
                      handleMarkAsPaid(selectedBill.Id);
                      setShowModal(false);
                    }}
                  >
                    Mark as Paid
                  </Button>
                )}
                <Button variant="primary">
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;