import 'package:flutter_bloc/flutter_bloc.dart';
import 'settings_event.dart';
import 'settings_state.dart';

class SettingsBloc extends Bloc<SettingsEvent, SettingsState> {
  SettingsBloc() : super(const SettingsState()) {
    on<LoadSettings>(_onLoadSettings);
    on<UpdateBaseUrl>(_onUpdateBaseUrl);
  }

  void _onLoadSettings(LoadSettings event, Emitter<SettingsState> emit) async {
    emit(state.copyWith(status: SettingsStatus.loading));
    // Simulate loading from local storage
    await Future.delayed(const Duration(milliseconds: 300));
    emit(state.copyWith(status: SettingsStatus.loaded));
  }

  void _onUpdateBaseUrl(UpdateBaseUrl event, Emitter<SettingsState> emit) {
    emit(
      state.copyWith(baseUrlPath: event.baseUrl, status: SettingsStatus.loaded),
    );
  }
}
