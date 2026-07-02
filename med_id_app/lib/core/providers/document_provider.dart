import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/document_model.dart';
import '../utils/mock_api_service.dart';

class DocumentState {
  final bool isLoading;
  final String? error;
  final List<DocumentModel> documents;

  const DocumentState({this.isLoading = false, this.error, this.documents = const []});

  DocumentState copyWith({bool? isLoading, String? error, List<DocumentModel>? documents}) {
    return DocumentState(isLoading: isLoading ?? this.isLoading, error: error, documents: documents ?? this.documents);
  }
}

class DocumentNotifier extends StateNotifier<DocumentState> {
  final MockApiService _api = MockApiService();

  DocumentNotifier() : super(const DocumentState());

  Future<void> loadDocuments(String patientId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final docs = await _api.getDocuments(patientId);
      state = DocumentState(isLoading: false, documents: docs);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> addDocument(DocumentModel doc) async {
    try {
      await _api.addDocument(doc);
      state = state.copyWith(documents: [...state.documents, doc]);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> deleteDocument(String docId) async {
    try {
      await _api.deleteDocument(docId);
      state = state.copyWith(documents: state.documents.where((d) => d.id != docId).toList());
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }
}

final documentProvider = StateNotifierProvider<DocumentNotifier, DocumentState>((ref) => DocumentNotifier());
