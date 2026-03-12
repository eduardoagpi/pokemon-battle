import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/repositories/general_repository.dart';
import 'settings_event.dart';
import 'settings_state.dart';

class SettingsBloc extends Bloc<SettingsEvent, SettingsState> {
  final GeneralRepository generalRepository;

  SettingsBloc({required this.generalRepository})
    : super(const SettingsState()) {
    on<LoadSettings>(_onLoadSettings);
    on<UpdateBaseUrl>(_onUpdateBaseUrl);
    on<SaveSettings>(_onSaveSettings);
  }

  void _onLoadSettings(LoadSettings event, Emitter<SettingsState> emit) async {
    emit(state.copyWith(status: SettingsStatus.loading));
    final savedUrl = generalRepository.getApiUrl();
    if (savedUrl != null && savedUrl.isNotEmpty) {
      emit(
        state.copyWith(baseUrlPath: savedUrl, status: SettingsStatus.loaded),
      );
    } else {
      emit(state.copyWith(status: SettingsStatus.loaded));
    }
  }

  void _onUpdateBaseUrl(UpdateBaseUrl event, Emitter<SettingsState> emit) {
    emit(
      state.copyWith(baseUrlPath: event.baseUrl, status: SettingsStatus.loaded),
    );
  }

  void _onSaveSettings(SaveSettings event, Emitter<SettingsState> emit) async {
    await generalRepository.saveApiUrl(state.baseUrlPath);
    emit(state.copyWith(status: SettingsStatus.loaded));
  }
}
