package com.medid.service;

import com.medid.model.Transaction;
import com.medid.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ClinicFinanceService {

    private final TransactionRepository repository;

    public ClinicFinanceService(TransactionRepository repository) {
        this.repository = repository;
    }

    public List<Transaction> getTransactionsByClinic(String clinicId) {
        return repository.findByClinicId(clinicId);
    }

    public Transaction createTransaction(Transaction transaction) {
        if (transaction.getStatus() == null) {
            transaction.setStatus(Transaction.Status.COMPLETED);
        }
        return repository.save(transaction);
    }

    public Map<String, Object> getClinicFinanceSummary(String clinicId) {
        var transactions = repository.findByClinicId(clinicId);
        var totalRevenue = transactions.stream()
            .filter(t -> t.getStatus() == Transaction.Status.COMPLETED)
            .mapToDouble(t -> t.getType() == Transaction.Type.PAYMENT ? t.getAmount() : -t.getAmount())
            .sum();
        var paymentCount = transactions.stream()
            .filter(t -> t.getType() == Transaction.Type.PAYMENT && t.getStatus() == Transaction.Status.COMPLETED)
            .count();
        var refundCount = transactions.stream()
            .filter(t -> t.getType() == Transaction.Type.REFUND && t.getStatus() == Transaction.Status.COMPLETED)
            .count();
        return Map.of(
            "totalRevenue", totalRevenue,
            "paymentCount", paymentCount,
            "refundCount", refundCount,
            "transactionCount", transactions.size()
        );
    }
}
